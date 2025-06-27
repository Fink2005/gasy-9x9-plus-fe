import React from 'react';

const
  RootTemplate = (props: {
    children: React.ReactNode;
  }) => {
    return (
      <main className="flex flex-col items-center bg-[#000C36]">
        <div className="w-full sm:max-w-[450px]">
          {props.children}
        </div>
      </main>
    );
  };

export default RootTemplate;
