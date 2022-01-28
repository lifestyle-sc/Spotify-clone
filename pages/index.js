import Head from "next/head";
import { getSession } from "next-auth/react";
import Body from "../components/layout/Body";
import Sidebar from "../components/layout/Sidebar";
import Player from "../components/layout/Player";
import Alert from "../components/layout/Alert";

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Alert />
      <main className="flex">
        {/* Sidebar */}
        <Sidebar />
        {/* Body */}
        <Body />
      </main>

      <div className="sticky bottom-0">
        {/* Footer */}
        <Player />
        </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
