using QuizAuthApi.Models;
using System.Threading.Tasks;

namespace QuizAuthApi.Interfaces
{
    public interface ITokenService
    {
        Task<string> CreateToken(AppUser user);
    }
}
