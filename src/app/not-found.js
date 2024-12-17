"use client";

import Image from "next/image";

const Custom404 = () => {
  return (
    <>
      <div className="center-div">
        <Image
          src="/images/notfound.png"
          alt="notfound-image"
          width={650}
          height={650}
          className="block"
        />
        <p className="text-disable text-base font-bold mt-10">
          Oops! We are unable to find the page you are looking for! Click{" "}
          <span className="text-success font-bold">“Retry Action” </span> button to get results.
        </p>
        {/* <Button
          type="button"
          size="medium"
          //   onClick={btn.onClick || handleSubmit}
          variant="primary"
          className="w-1/2 mx-auto mt-6"
        >
          Retry Action
        </Button> */}
      </div>
      <style jsx>{`
        .center-div {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>
    </>
  );
};

export default Custom404;
