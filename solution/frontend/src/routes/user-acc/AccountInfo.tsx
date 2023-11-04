import { useEffect, useState } from "react";
import { djangoUserData } from "../../django";

export default function AccountInfo() {
  const MD_BREAKPOINT = 768;
  const { username, firstName, lastName } = djangoUserData;

  const greeting = firstName && lastName ? `${firstName} ${lastName}` : username;

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });
  }, []);

  return (
    <div>
      <h1>Hello, {greeting}</h1>
      <p>
        Welcome to your account dashboard. Use the navigation{" "}
        {windowWidth < MD_BREAKPOINT ? "above " : "on the left hand side "} to manage your account.
      </p>
    </div>
  );
}
