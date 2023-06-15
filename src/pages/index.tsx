import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { RouterOutputs, api } from "~/utils/api";
import { SignInButton, useUser} from "@clerk/nextjs";
import dayjs from "dayjs";
import  Image  from "next/image"
import relativeTime from "dayjs/plugin/relativeTime"
import { LoadingPage } from "~/components/loading";
import { error } from "console";
// I'm lost

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const {user} = useUser();

  console.log(user);

  if (!user) return null;

  return ( 
    <div className="flex gap-3 w-full">
      <Image 
        src={user.profileImageUrl}
        alt="Profile image" 
        className="w-20 h-20 rounded-full"
        width={56}
        height={56}
      />
      <input placeholder="Type some emojis!" className="grow bg-transparent outline-none"/>
    </div> 
  )  
}

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="border-b border-slate-400 p-4 gap-3 flex">
      <Image 
        src={author.profileImageUrl}
        alt="Profile image"
        className="w-20 h-20 rounded-full"
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div className="flex text-slate-300 gap-1">
          <span>{`@${author.username}`}</span>
          <span className="font-thin">{`  · ${dayjs(post.createdAt).fromNow}`}</span>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  )
}

const Feed = () => {
  const {data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (!postsLoading) return <LoadingPage />;

  if (!data) return <div> Something went wrong. </div>

  return (
    <div className="flex flex-col">
      {[...data, ...data]?.map((fullPost) => (<PostView {...fullPost} key={fullPost.post.id}/>))}
    </div>
  )

}

const Home: NextPage = () => {

  const { isLoaded: userLoaded, isSignedIn } = useUser();

  //start fetching
  api.posts.getAll.useQuery();

  // weird behaviour
  if ( !userLoaded ) return <div />;

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
            {!isSignedIn && (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}  
            {isSignedIn && <CreatePostWizard />}  
          </div>
          
          <Feed />
        </div>
      </main>
    </>
  );
};

export default Home;
