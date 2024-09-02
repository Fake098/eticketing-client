import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = ({ element }) => {
	const token = Cookies.get("authToken");

	return token ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
