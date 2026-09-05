import type { ReactElement } from "react";

export interface RailAppProps {
  initialScreen?: string;
}

declare const RailApp: (props?: RailAppProps) => ReactElement;
export default RailApp;
