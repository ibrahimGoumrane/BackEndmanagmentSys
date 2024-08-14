export const emailRequestTeamTemplate = (
  userId: string,
  id: string,
  name: string,
  type: string = "team"
) => {
  return `
        <div style="background-color: #f9f9f9; color: #333333; padding: 40px; font-family: 'Helvetica Neue', Arial, sans-serif; border-radius: 8px; max-width: 600px; margin: auto;">
          <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 24px; color: #2D3748;"> ${
            type === "team" ? "Group Chat" : "Project"
          }  Join Request</h1>
          <p style="font-size: 18px; margin-bottom: 32px;">
            <strong>${name}</strong> is requesting to join your  ${
    type === "team" ? "Group Chat" : "Project"
  } . To maintain a safe and engaging environment, please review and approve or reject this request.
          </p>
          <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 16px; color: #2D3748;">Why are we doing this?</h2>
          <p style="font-size: 16px; margin-bottom: 32px;">
            This ensures that only approved members join the conversation, helping to prevent any disruptions and maintain the quality of the discussions.
          </p>
          <div style="display: flex; justify-content: space-around; margin-top: 20px;">
           ${
             type === "team"
               ? ` <a href="http://localhost:5010/api/teams/requestJoin/response?userId=${userId}&teamId=${id}&status=ACCEPTED" style="padding: 12px 24px; background-color: #38A169; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">Accept</a>
            <a href="http://localhost:5010/api/teams/requestJoin/response?userId=${userId}&teamId=${id}&status=REJECTED" style="padding: 12px 24px; background-color: #E53E3E; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">Reject</a>`
               : `  <a href="http://localhost:5010/api/projects/requestJoin/response?userId=${userId}&projectId=${id}&status=ACCEPTED" style="padding: 12px 24px; background-color: #38A169; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">Accept</a>
            <a href="http://localhost:5010/api/projects/requestJoin/response?userId=${userId}&projectId=${id}&status=REJECTED" style="padding: 12px 24px; background-color: #E53E3E; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">Reject</a>`
           } 
           
          </div>
        </div>
      `;
};
export const acceptanceRequestTeamEmail = (
  userName: string,
  type: string = "team"
) => {
  return `
        <div style="background-color: #ffffff; color: #333333; padding: 40px; font-family: 'Helvetica Neue', Arial, sans-serif; border-radius: 8px; max-width: 600px; margin: auto; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 24px; color: #2D3748;">Welcome to the ${
            type === "team" ? "Group Chat" : "Project"
          } , ${userName}!</h1>
          <p style="font-size: 18px; margin-bottom: 24px;">
              We're thrilled to have you on board. Your request to join the ${
                type === "team" ? "Group Chat" : "Project"
              }  has been accepted, and you can now join the conversation and share your insights with other members.
          </p>
          <p style="font-size: 18px; margin-bottom: 32px;">
          Click the button below   ${
            type === "team" ? "  to start chatting" : "to start working"
          } 

          </p>
          <a href="https://yourdomain.com/group-chat" style="display: inline-block; padding: 12px 24px; background-color: #38A169; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">Join the  ${
            type === "team" ? "Group Chat" : "Project"
          } </a>
          <p style="font-size: 16px; margin-top: 40px;">
              We look forward to your participation!
          </p>
          <p style="font-size: 16px; margin-top: 20px; color: #A0AEC0;">
              Best regards,<br/>The  ${
                type === "team" ? "Group Chat" : "Project"
              }  Team
          </p>
        </div>`;
};
export const rejectionRequestTeamEmail = (
  userName: string,
  type: string = "team"
) => {
  return `
        <div style="background-color: #ffffff; color: #333333; padding: 40px; font-family: 'Helvetica Neue', Arial, sans-serif; border-radius: 8px; max-width: 600px; margin: auto; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 24px; color: #2D3748;">${
            type === "team" ? "Group Chat" : "Project"
          }  Request Update, ${userName}</h1>
          <p style="font-size: 18px; margin-bottom: 32px;">
              Unfortunately, your request to join the ${
                type === "team" ? "Group Chat" : "Project"
              }  has been declined. This decision was made to maintain the balance and quality of the conversations within the group.
          </p>
          <p style="font-size: 18px; margin-bottom: 32px;">
              If you have any questions or think there was an error, please feel free to contact us for further clarification.
          </p>
          <p style="font-size: 16px; margin-top: 40px; color: #A0AEC0;">
              Best regards,<br/>The ${
                type === "team" ? "Group Chat" : "Project"
              }  Team
          </p>
        </div>`;
};
