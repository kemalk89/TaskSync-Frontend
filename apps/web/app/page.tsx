import styles from "./page.module.css";
import { auth } from "./auth";
import { SignIn } from "./components/sign-in";

export default async function Home() {
  const session = await auth();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.ctas}>
          {session?.user ? (
            <div>
              <h1>Ideas for this page</h1>
              <ul>
                <li>Last visited tickets</li>
                <li>Last added comments</li>
              </ul>
            </div>
          ) : (
            <SignIn provider="auth0" />
          )}
        </div>
      </main>
      <footer className={styles.footer}>TaskSync</footer>
    </div>
  );
}
