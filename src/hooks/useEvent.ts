import { useEffect } from "react";

//custom hook to register and remove event listeners
function useEvent(event: any, handler: any, props: any, element: any = window) {
  useEffect(() => {
    element?.addEventListener(event, handler);

    return () => {
      element?.removeEventListener(event, handler);
    };
  }, [props]);
}

//custom hook with element exposed
export function useElementEvent(event: any, handler: any, props: any, element: any = window) {
  useEffect(() => {
    element?.addEventListener(event, (e:any) => handler(e, element));

    return () => {
      element?.removeEventListener(event, (e:any) => handler(e, element));
    };
  }, [props]);
}

export default useEvent;