using Microsoft.AspNetCore.Identity;
using QuizAuthApi.Models;

namespace QuizAuthApi.Data
{
    public static class SeedData
    {
        public static async Task SeedRolesAndAdminAsync(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            // Create Roles if they don't exist
            var roles = new[] { "Admin", "User" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            // Create Admin User if it doesn't exist
            string adminUserName = "admin";
            string adminEmail = "admin@example.com";
            string adminPassword = "Admin1234$";

            var adminUser = await userManager.FindByNameAsync(adminUserName);
            if (adminUser == null)
            {
                var newAdmin = new AppUser
                {
                    UserName = adminUserName,
                    Email = adminEmail
                };

                var result = await userManager.CreateAsync(newAdmin, adminPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(newAdmin, "Admin");
                }
            }
        }
    }
}
