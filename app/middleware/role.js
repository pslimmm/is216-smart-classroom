export default defineNuxtRouteMiddleware((to, from) => {
    const { role } = useRole();

    const commonRoutes = ['/forbidden', '/'];

    const noRoleRoutes = ['/auth', ...commonRoutes];
    const loggedInRoutes = ['/profile', '/dashboard', '/courses', ...commonRoutes];
    const studentRoutes = ['/student', '/marketplace', ...loggedInRoutes];
    const taRoutes = ['/ta', '/classreport', loggedInRoutes];
    const profRoutes = ['/prof', '/marketplace', '/classreport', ...loggedInRoutes];

    if ([...noRoleRoutes, ...commonRoutes].includes(to.path)) {
        return;
    }

    if (!role.value) {
        return abortNavigation(showError({ statusMessage: "You don't have access to this page", statusCode: 401 }));
    }

    const allowedRoutes = {
        student: studentRoutes,
        ta: taRoutes,
        prof: profRoutes,
    };

    const allowed = allowedRoutes[role.value] || [];

    if (!allowed.includes(to.path)) {
        return abortNavigation(showError({ statusMessage: "You don't have access to this page", statusCode: 401 }));
    }
});

// Edited as I was having issues going from /index -> /auth - Vinz

// export default defineNuxtRouteMiddleware((to, from) => {
//     const { role } = useRole();

//     const noRoleRoutes = ['/auth', '/register'];
//     const commonRoutes = ['/forbidden', '/']
//     const loggedInRoutes = ['/profile', '/profile', '/dashboard', '/courses'];
//     const studentRoutes = ['/student', '/marketplace'];
//     const taRoutes = ['/ta', '/classreport'];
//     const profRoutes = ['/prof', '/marketplace', '/classreport'];

//     if(role.value == null && ![...noRoleRoutes, ...commonRoutes].includes(to.path)){
//         return abortNavigation(showError({statusMessage: "You don't have access to this page", statusCode: 401}));
//     } else if(role.value == "ta" && !([...loggedInRoutes, ...taRoutes, ...commonRoutes].includes(to.path)) && noRoleRoutes.includes(to.path)){
//         return abortNavigation(showError({statusMessage: "You don't have access to this page", statusCode: 401}));
//     } else if(role.value == "prof" && !([...loggedInRoutes, ...profRoutes, ...commonRoutes].includes(to.path)) && noRoleRoutes.includes(to.path)){
//         return abortNavigation(showError({statusMessage: "You don't have access to this page", statusCode: 401}));
//     } else if(role.value == "student" && !([...loggedInRoutes, ...studentRoutes, ...commonRoutes].includes(to.path)) && noRoleRoutes.includes(to.path)){
//         return abortNavigation(showError({statusMessage: "You don't have access to this page", statusCode: 401}));
//     }

// });