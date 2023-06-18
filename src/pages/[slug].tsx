import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { useUser} from "@clerk/nextjs";

const ProfilePage: NextPage = () => {

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <main className="flex justify-center h-screen">
        <div>User Profile View</div>
      </main>
    </>
  );
};

export default ProfilePage;
