"use client";

export const GoogleBtn: React.FC = () => {
  const onClick = () => {
    console.log("first");
  };
  // ['#4285F4', '#34A853', '#FBBC05', '#EA4335']
  return (
    <button
      onClick={onClick}
      className="group relative w-64 h-12 rounded-full overflow-hidden text-[#34A853]"
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full aspect-1/1 flex items-center justify-center transition-all ease-in-out group-hover:animate-[spin_5s_linear_infinite]  ">
        <div className="w-full h-1/1 bg-[conic-gradient(#34A853_0deg,#FBBC05_25deg,#EA4335_50deg,#4285F4_125deg,#34A853_125deg)]"></div>
      </div>
      <span className="absolute inset-0 z-10 m-1 bg-gray-600 text-xl font-medium rounded-full">
        Google AI
      </span>
    </button>
  );
};

{/* <div className="flex w-1/2 h-full flex-col items-center justify-center">
          <div className="w-full flex aspect-1/2"> */}
            {/* <div className="w-full full bg-gradient-to-r from-[#34A853]/0 via-[#34A853] to-[#34A853]/0 mr-[-8px]" />

            <div className="w-full full bg-gradient-to-r from-[#FBBC05]/0  to-[#FBBC05]"></div>
            <div className="w-full h-full bg-linear-to-r from-[#EA4335]/0 to-[#EA4335]"></div>
            <div className="w-full h-full bg-linear-to-r from-purple-400/0 to-purple-400"></div> */}
        //   </div>

          {/* <div className="w-full aspect-1/2 bg-[#4285F4]" /> */}
        {/* </div> */}