const Timer = ({ seconds }: { seconds: number }) => {
  return (
    <p>{`${Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`}</p>
  );
};

export { Timer };
