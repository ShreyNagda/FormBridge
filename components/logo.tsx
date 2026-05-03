import Image from "next/image";

export const Logo = () => {
  return (
    <div className="flex items-center justify-center">
      <Image
        src="/logo.png"
        alt="Logo"
        width={32}
        height={32}
        className="block dark:invert"
      />
    </div>
  );
};
