import { beforeEach, describe, expect, mock, test } from "bun:test";
import { UserType, type VerifiedUser } from "./auth";

// Regression test for #41: creating a user from a per-project Users page
// must link the new user to that project.

const createUser = mock(async () => ({
  id: 42,
  name: "New User",
  email: "new@example.com",
  type: "USER",
  projectIds: [] as number[],
}));
const linkToProject = mock(async () => {});

let sessionUser: VerifiedUser | null;

mock.module("@/lib/juno", () => ({
  getJunoInstance: () => ({ user: { createUser, linkToProject } }),
}));
mock.module("@/lib/session", () => ({
  getSession: async () =>
    sessionUser ? { jwt: "test-jwt", user: sessionUser } : null,
}));

const { createUserAction } = await import("./actions");

const admin = (projectIds: number[]): VerifiedUser => ({
  id: 1,
  email: "admin@example.com",
  name: "Admin",
  type: UserType.ADMIN,
  projectIds,
});

const input = {
  name: "New User",
  email: "new@example.com",
  password: "hunter22",
};

beforeEach(() => {
  createUser.mockClear();
  linkToProject.mockClear();
  linkToProject.mockImplementation(async () => {});
  sessionUser = admin([7]);
});

describe("createUserAction", () => {
  test("links the new user to the originating project", async () => {
    const result = await createUserAction({ ...input, projectId: 7 });

    expect(result.success).toBe(true);
    expect(linkToProject).toHaveBeenCalledTimes(1);
    expect(linkToProject).toHaveBeenCalledWith({
      credentials: "test-jwt",
      project: { id: 7 },
      userId: "42",
    });
    expect(result.user?.projectIds).toEqual([7]);
    expect(result.linkError).toBeUndefined();
  });

  test("does not link when no project is given (admin Users page)", async () => {
    const result = await createUserAction(input);

    expect(result.success).toBe(true);
    expect(linkToProject).not.toHaveBeenCalled();
    expect(result.user?.projectIds).toEqual([]);
  });

  test("rejects linking to a project the admin cannot access", async () => {
    const result = await createUserAction({ ...input, projectId: 99 });

    expect(result.success).toBe(false);
    expect(createUser).not.toHaveBeenCalled();
    expect(linkToProject).not.toHaveBeenCalled();
  });

  test("superadmins can create into any project", async () => {
    sessionUser = { ...admin([]), type: UserType.SUPERADMIN };
    const result = await createUserAction({ ...input, projectId: 99 });

    expect(result.success).toBe(true);
    expect(result.user?.projectIds).toEqual([99]);
  });

  test("reports a link failure without losing the created user", async () => {
    linkToProject.mockImplementation(async () => {
      throw new Error("boom");
    });
    const result = await createUserAction({ ...input, projectId: 7 });

    expect(result.success).toBe(true);
    expect(result.user?.id).toBe(42);
    expect(result.user?.projectIds).toEqual([]);
    expect(result.linkError).toBeString();
  });

  test("shows juno's message for a duplicate email (gRPC text body)", async () => {
    createUser.mockImplementationOnce(async () => {
      throw Object.assign(new Error("Response returned an error code"), {
        response: new Response(
          "6 ALREADY_EXISTS: The resource already exists.",
          { status: 409 },
        ),
      });
    });
    const result = await createUserAction(input);

    expect(result.success).toBe(false);
    expect(result.error).toBe("The resource already exists.");
  });

  test("joins validation messages from a JSON body", async () => {
    createUser.mockImplementationOnce(async () => {
      throw Object.assign(new Error("Response returned an error code"), {
        response: Response.json(
          { message: ["email must be an email", "password too short"] },
          { status: 400 },
        ),
      });
    });
    const result = await createUserAction(input);

    expect(result.error).toBe("email must be an email, password too short");
  });
});
