"use client";

const Content = ({ children }) => {

  return (
    <div className="content h-full">
      {/* <Header /> */}
      {children}
      <style jsx>{`
        .content::-webkit-scrollbar {
          display: none;
        }
        .content {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default Content;
