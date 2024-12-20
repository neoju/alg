export default function Footer() {
  return (
    <>
      <div className="flex justify-center gap-4 mt-2">
        <div className="flex items-center gap-2">
          <span className="bg-primary h-4 w-4 inline-block rounded"></span>
          <span className="text-xs">current item</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-success h-4 w-4 inline-block rounded"></span>
          <span className="text-xs"> item to swap</span>
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-2">
        <p className="text-xs">
          To enable colorful mode please keep animation speed lowser than 91
        </p>
      </div>
    </>
  );
}
