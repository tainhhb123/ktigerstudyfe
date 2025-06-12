import { JSX } from "react";
import { Outlet } from "react-router-dom";

export default function Library(): JSX.Element {
  return (
    <div >
      <Outlet />
    </div>
  );
}
