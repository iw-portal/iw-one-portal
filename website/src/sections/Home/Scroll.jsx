const ScrollingText = () => {
  const content = (
    <>
      {[...Array(6)].map((_, i) => (
        <a href="/programs/skills-development">
          <span key={i} className="mx-8 inline-block text-2xl">
            Interested in volunteering?{" "}
            <span className="ml-1 font-bold">Register now: </span>
            <span className="text-red-600 ml-1 font-bold">CLICK HERE</span>
          </span>
        </a>
      ))}
    </>
  );

  return (
    <div className="w-full overflow-hidden bg-gray-100 py-2">
      <div className="flex w-max animate-infinite-scroll whitespace-nowrap">
        {content}
      </div>
    </div>
  );
};

export default ScrollingText;
