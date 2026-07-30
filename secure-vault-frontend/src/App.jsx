import { Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/layout/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import Upload from "./pages/Upload";
import MyDocuments from "./pages/MyDocuments";
import SharedDocuments from "./pages/SharedDocuments";
import Profile from "./pages/Profile";

import AdminPanel from "./pages/AdminPanel";
import AuditLogs from "./pages/AuditLogs";

import NotFound from "./pages/NotFound";

import VersionHistory from "./pages/VersionHistory";

// Dashboard

import RoleRedirect from "./components/layout/RoleRedirect";

import AdminDashboard from "./pages/dashboard/AdminDashboard";
import HRDashboard from "./pages/dashboard/HRDashboard";
import ManagerDashboard from "./pages/dashboard/ManagerDashboard";
import UserDashboard from "./pages/dashboard/UserDashboard";

// HR

import HRUsers from "./pages/hr/HRUsers";
import HRDocuments from "./pages/hr/HRDocuments";
import HRDepartments from "./pages/hr/HRDepartments";


// Manager

import ManagerUsers from "./pages/manager/ManagerUsers";
import ManagerDocuments from "./pages/manager/ManagerDocuments";
import ManagerSharing from "./pages/manager/ManagerSharing";

//Admin
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDocuments from "./pages/admin/AdminDocuments";
import AdminSharing from "./pages/admin/AdminSharing";
import AdminAccess from "./pages/admin/AdminAccess";
import AdminVersions from "./pages/admin/AdminVersions";
import AdminDepartments from "./pages/admin/AdminDepartments";
import AdminPermissions from "./pages/admin/AdminPermissions";

function App() {


return (

<Routes>



{/* =====================
    PUBLIC ROUTES
===================== */}


<Route path="/" element={<Login/>}/>

<Route path="/login" element={<Login/>}/>

<Route 
path="/forgot-password"
element={<ForgotPassword/>}
/>





{/* =====================
    ROLE DASHBOARD
===================== */}


<Route

path="/dashboard"

element={

<ProtectedRoute>

<Layout>

<RoleRedirect/>

</Layout>

</ProtectedRoute>

}

/>





{/* =====================
    COMMON FEATURES
===================== */}



<Route

path="/upload"

element={

<ProtectedRoute>

<Layout>

<Upload/>

</Layout>

</ProtectedRoute>

}

/>



<Route

path="/my-documents"

element={

<ProtectedRoute>

<Layout>

<MyDocuments/>

</Layout>

</ProtectedRoute>

}

/>

<Route

path="/documents/:id/versions"

element={

<ProtectedRoute>

<Layout>

<VersionHistory/>

</Layout>

</ProtectedRoute>

}

/>


<Route

path="/shared"

element={

<ProtectedRoute>

<Layout>

<SharedDocuments/>

</Layout>

</ProtectedRoute>

}

/>



<Route

path="/profile"

element={

<ProtectedRoute>

<Layout>

<Profile/>

</Layout>

</ProtectedRoute>

}

/>





{/* =====================
       ADMIN
===================== */}

<Route
    path="/admin/users"
    element={
        <ProtectedRoute>
            <Layout>
                <AdminUsers />
            </Layout>
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/departments"
    element={
        <ProtectedRoute>
            <Layout>
                <AdminDepartments />
            </Layout>
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/documents"
    element={
        <ProtectedRoute>
            <Layout>
                <AdminDocuments />
            </Layout>
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/sharing"
    element={
        <ProtectedRoute>
            <Layout>
                <AdminSharing />
            </Layout>
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/access"
    element={
        <ProtectedRoute>
            <Layout>
                <AdminAccess />
            </Layout>
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/versions"
    element={
        <ProtectedRoute>
            <Layout>
                <AdminVersions />
            </Layout>
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/permissions"
    element={<AdminPermissions />}
/>

<Route

path="/admin"

element={

<ProtectedRoute allowedRoles={["ADMIN"]}>

<Layout>

<AdminPanel/>

</Layout>

</ProtectedRoute>

}

/>



<Route

path="/audit"

element={

<ProtectedRoute allowedRoles={["ADMIN","HR"]}>

<Layout>

<AuditLogs/>

</Layout>

</ProtectedRoute>

}

/>





{/* =====================
       HR MODULE
===================== */}



<Route

path="/register"

element={

<ProtectedRoute allowedRoles={["ADMIN","HR"]}>

<Layout>

<Register/>

</Layout>

</ProtectedRoute>

}

/>



<Route

path="/hr/users"

element={

<ProtectedRoute allowedRoles={["ADMIN","HR"]}>

<Layout>

<HRUsers/>

</Layout>

</ProtectedRoute>

}

/>



<Route

path="/hr/documents"

element={

<ProtectedRoute allowedRoles={["ADMIN","HR"]}>

<Layout>

<HRDocuments/>

</Layout>

</ProtectedRoute>

}

/>



<Route

path="/hr/departments"

element={

<ProtectedRoute allowedRoles={["ADMIN","HR"]}>

<Layout>

<HRDepartments/>

</Layout>

</ProtectedRoute>

}

/>





{/* =====================
       MANAGER MODULE
===================== */}



<Route

path="/manager/users"

element={

<ProtectedRoute allowedRoles={["ADMIN","MANAGER"]}>

<Layout>

<ManagerUsers/>

</Layout>

</ProtectedRoute>

}

/>



<Route

path="/manager/documents"

element={

<ProtectedRoute allowedRoles={["ADMIN","MANAGER"]}>

<Layout>

<ManagerDocuments/>

</Layout>

</ProtectedRoute>

}

/>

<Route
    path="/manager/sharing"
    element={
        <ProtectedRoute>
            <Layout>
                <ManagerSharing />
            </Layout>
        </ProtectedRoute>
    }
/>





{/* =====================
       DIRECT DASHBOARD ACCESS
===================== */}



<Route

path="/admin/dashboard"

element={

<ProtectedRoute allowedRoles={["ADMIN"]}>

<Layout>

<AdminDashboard/>

</Layout>

</ProtectedRoute>

}

/>



<Route

path="/hr/dashboard"

element={

<ProtectedRoute allowedRoles={["ADMIN","HR"]}>

<Layout>

<HRDashboard/>

</Layout>

</ProtectedRoute>

}

/>



<Route

path="/manager/dashboard"

element={

<ProtectedRoute allowedRoles={["ADMIN","MANAGER"]}>

<Layout>

<ManagerDashboard/>

</Layout>

</ProtectedRoute>

}

/>



<Route

path="/user/dashboard"

element={

<ProtectedRoute allowedRoles={["USER"]}>

<Layout>

<UserDashboard/>

</Layout>

</ProtectedRoute>

}

/>





{/* =====================
       404
===================== */}



<Route

path="*"

element={

<ProtectedRoute>

<Layout>

<NotFound/>

</Layout>

</ProtectedRoute>

}

/>



</Routes>

);

}


export default App;