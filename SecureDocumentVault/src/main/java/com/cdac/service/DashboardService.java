package com.cdac.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;


import com.cdac.dto.DashboardResponse;
import com.cdac.entity.User;
import com.cdac.repository.DepartmentRepository;
import com.cdac.repository.DocumentRepository;
import com.cdac.repository.UserRepository;



@Service
public class DashboardService {



    @Autowired
    private UserRepository userRepository;


    @Autowired
    private DocumentRepository documentRepository;


    @Autowired
    private DepartmentRepository departmentRepository;





    // ===========================
    // ADMIN DASHBOARD
    // ===========================

    public DashboardResponse getAdminStats(){


        long users =
                userRepository.count();


        long documents =
                documentRepository.count();


        long departments =
                departmentRepository.count();


        long expired =
                documentRepository.countByExpired(true);



        return new DashboardResponse(

                users,

                documents,

                0,

                departments,

                expired

        );

    }








    // ===========================
    // HR DASHBOARD
    // ===========================

    public DashboardResponse getHrStats(){


        long users =
                userRepository.count();


        long documents =
                documentRepository.count();


        long departments =
                departmentRepository.count();



        return new DashboardResponse(

                users,

                documents,

                0,

                departments,

                0

        );

    }









    // ===========================
    // MANAGER DASHBOARD
    // ===========================

    public DashboardResponse getManagerStats(){


        Authentication authentication =
                SecurityContextHolder
                .getContext()
                .getAuthentication();



        User user =
                userRepository
                .findByEmail(authentication.getName())
                .orElseThrow();



        List<User> departmentUsers =
                userRepository
                .findByDepartment(
                        user.getDepartment()
                );



        long teamDocuments =
                documentRepository
                .countByUser_Department(
                        user.getDepartment()
                );



        DashboardResponse response =
                new DashboardResponse(

                        0,

                        teamDocuments,

                        0,

                        departmentUsers.size(),

                        0

                );



        response.setDepartmentName(

                user.getDepartment()
                .getDepartmentName()

        );



        return response;

    }









    // ===========================
    // USER DASHBOARD
    // ===========================

    public DashboardResponse getUserStats(){


        Authentication authentication =
                SecurityContextHolder
                .getContext()
                .getAuthentication();



        User user =
                userRepository
                .findByEmail(authentication.getName())
                .orElseThrow();



        long documents =
                documentRepository
                .countByUser(user);



        return new DashboardResponse(

                0,

                0,

                documents,

                0,

                0

        );


    }


}