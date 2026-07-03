import { NextResponse } from "next/server";
import { findByKey, posts } from "../../../../lib/data";
import { requireUserResponse } from "../../../../lib/session";

type RouteContext = { params: Promise<{ postId: string }> };

export async function POST(_request: Request, { params }: RouteContext) {
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
