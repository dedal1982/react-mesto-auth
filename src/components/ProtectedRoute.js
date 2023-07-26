import React from 'react';
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ element: Component, ...props }) => {
	return (
		props.loggedIn ? <Component {...props} /> : <Navigate to="/sign-in" replace />
	)
}