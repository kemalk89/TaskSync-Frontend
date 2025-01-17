import Image, { type ImageProps } from "next/image";
import styles from "./page.module.css";
import { auth } from "./auth";
import { SignOut } from "./components/sign-out";
import { SignIn } from "./components/sign-in";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default async function Home() {
  const session = await auth();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ThemeImage
          className={styles.logo}
          srcLight="turborepo-dark.svg"
          srcDark="turborepo-light.svg"
          alt="Turborepo logo"
          width={180}
          height={38}
          priority
        />

        <div className={styles.ctas}>
          {session?.user ? <SignOut /> : <SignIn provider="auth0" />}
        </div>
      </main>
      <footer className={styles.footer}>TaskSync</footer>
    </div>
  );
}
