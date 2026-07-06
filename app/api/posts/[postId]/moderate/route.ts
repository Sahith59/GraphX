import { withBold } from "@boldsec/next";
import { NextResponse } from "next/server";
import { resolveAdminPrivilege, resolveCallerId } from "../../../../lib/bold";
import { findByKey, posts } from "../../../../lib/data";
import { requireUserResponse } from "../../../../lib/session";

type RouteContext = { params: Promise<{ postId: string }> };

async function _bold_POST(_request: Request, { params }: RouteContext) {
  const auth = await requireUserResponse();
  if (auth.response) return auth.response;

  const { postId } = await params;
  const post = findByKey(posts, "postId", postId);
  if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });

  // Intentional BFLA for BoLD testing: should require moderator/admin, but role is not checked.
  return NextResponse.json({
    action: "moderate_post",
    postId: post.postId,
    authorId: post.authorId,
    performedBy: auth.user,
    status: "simulated_hidden"
  });
}

export const POST = withBold(
  _bold_POST,
  { resolveCallerId, privileged: true, resolveCallerPrivilege: resolveAdminPrivilege }
);
