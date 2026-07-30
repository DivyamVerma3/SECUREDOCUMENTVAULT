package com.cdac.dto;


public class DashboardResponse {


    private long totalUsers;

    private long totalDocuments;

    private long myDocuments;

    private long teamMembers;

    private long expiredDocuments;

    private String departmentName;



    public DashboardResponse() {
    }





    public DashboardResponse(
            long totalUsers,
            long totalDocuments,
            long myDocuments,
            long teamMembers,
            long expiredDocuments
    ){

        this.totalUsers = totalUsers;
        this.totalDocuments = totalDocuments;
        this.myDocuments = myDocuments;
        this.teamMembers = teamMembers;
        this.expiredDocuments = expiredDocuments;

    }





    public long getTotalUsers() {
        return totalUsers;
    }


    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }





    public long getTotalDocuments() {
        return totalDocuments;
    }


    public void setTotalDocuments(long totalDocuments) {
        this.totalDocuments = totalDocuments;
    }





    public long getMyDocuments() {
        return myDocuments;
    }


    public void setMyDocuments(long myDocuments) {
        this.myDocuments = myDocuments;
    }





    public long getTeamMembers() {
        return teamMembers;
    }


    public void setTeamMembers(long teamMembers) {
        this.teamMembers = teamMembers;
    }





    public long getExpiredDocuments() {
        return expiredDocuments;
    }


    public void setExpiredDocuments(long expiredDocuments) {
        this.expiredDocuments = expiredDocuments;
    }





    public String getDepartmentName() {
        return departmentName;
    }


    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

}