function FormInput(props) {
  return (
    <input
      className="focus: w-48  rounded-full border border-stone-200 bg-zinc-200 px-4 py-2 text-sm outline-none transition-all duration-300 placeholder:text-cyan-950 focus:ring focus:ring-amber-700 md:w-80 md:px-6 md:py-3 "
      type={props.type}
      name={props.name}
      placeholder={props.placeholder}
      required
    />
  );
}

export default FormInput;
