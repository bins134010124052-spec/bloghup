import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-3 flex items-center gap-3 text-sm text-slate-500">
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="rounded-full bg-slate-100 px-3 py-1">{post.category}</span>
      </div>
      <h2 className="text-xl font-semibold text-slate-900">{post.title}</h2>
      <p className="my-3 max-h-20 overflow-hidden text-ellipsis whitespace-pre-wrap text-slate-600">{post.content}</p>
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>{post.author?.name || 'Người dùng'}</span>
        <span>{post.likes?.length || 0} lượt thích</span>
      </div>
      <Link to={`/posts/${post._id}`} className="mt-4 inline-flex rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700">
        Xem chi tiết
      </Link>
    </article>
  );
}
