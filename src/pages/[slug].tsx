import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { useUser} from "@clerk/nextjs";


const ProfilePage: NextPage = () => {
  const {data, isLoading} = api.profile.getUserByUsername.useQuery({
    username: "stark5200", 
  });

  if (isLoading) return <div>Loading...</div>

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <main className="flex justify-center h-screen">
        <div>{data.username}</div>
      </main>
    </>
  );
};

/*
bunch of deprecated bullshit

export const getStaticProps = async (context) => {

  const ssg = createProxySSGHelpers({
    router: appRouter, 
    ctx: await createContext(), 
    tranformer: superjson, 
  });

}
*/

export default ProfilePage;
