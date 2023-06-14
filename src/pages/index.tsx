import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { RouterOutputs, api } from "~/utils/api";
import { SignInButton, SignOutButton, useUser, SignIn } from "@clerk/nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
// I'm lost

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const {user} = useUser();

  console.log(user);

  if (!user) return null;

  return ( 
    <div className="flex gap-3 w-full">
      <img src={user.profileImageUrl} alt="Profile image" className="w-20 h-20 rounded-full"/>
      <input placeholder="Type some emojis!" className="grow bg-transparent outline-none"/>
    </div> 
  )  
}

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="border-b border-slate-400 p-4 gap-3 flex">
      <img src={author.profileImageUrl} alt="Profile image" className="w-20 h-20 rounded-full"/>
      <div className="flex flex-col">
        <div className="flex text-slate-300 gap-1">
          <span>{`@${author.username}`}</span>
          <span className="font-thin">{`  · ${dayjs(post.createdAt).fromNow}`}</span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  )
}

const Home: NextPage = () => {

  const user = useUser();

  const {data, isLoading} = api.posts.getAll.useQuery();

  if (!data || isLoading) return <div>Loading...</div>

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center h-screen">
        <div className="bg-red-200 h-full w-full border-slate-400 md:max-w-2xl border-x">
          <div className="border-b border-slate-400 p-4 flex justify-center">
            {!user.isSignedIn && (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}  
            {user.isSignedIn && <CreatePostWizard />}  
          </div>
          <div className="flex flex-col">
            {[...data, ...data]?.map((fullPost) => (<PostView {...fullPost} key={fullPost.post.id}/>))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
