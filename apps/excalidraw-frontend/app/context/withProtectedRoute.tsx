import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "./AuthContext";

export const withProtectedRoute = (WrappedComponent: any) => {
    return (props: any) => {
        const context = useContext(AuthContext);
            if (!context) {
                return null;
            }
            const { login } = context;
        const router = useRouter();

        useEffect(() => {
            if (!login) {
                
                router.push("/signin");
            }
        }, [login, router]);

        if (!login) {
           
            return null;
        }

        return <WrappedComponent {...props} />;
    };
};
