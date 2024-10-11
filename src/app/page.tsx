export default function Home() {
  return (
    <div className="w-full flex flex-col bg-black">
      <div className="w-full min-h-screen mt-20 flex flex-row text-white">
        <div className="w-3/5 flex justify-center flex-col px-10 min-h-screen ">
          <p className="text-4xl">Park space</p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Exercitationem recusandae sed excepturi autem vel nobis sapiente ad.
            Aliquid, ut? Reiciendis voluptatum animi odit exercitationem rem
            itaque, cum tempore voluptatibus repellendus.
          </p>
        </div>
        <div className="w-2/5 pl-10 h-screen bg-cover bg-[url('/images/bg2.jpeg')]" />
      </div>
    </div>
  );
}
