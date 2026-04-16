/**
 * 
 * @param {*} user 
 * @returns 
 */
export const normalizeCreatorForTrend = (user) => {
  if (!user) {
    return {
      _id: null,
      username: 'Deleted user',
      profile_img: null,
      githubUsername: '',
      privacy: true,
      isDeleted: true,
    };
  }//ADDED: normalized missing creator +hard-deleted or broken ref

  if (user.isDeleted) {
    return {
      ...user,
      githubUsername: '',
      privacy: true,
    };
  }// if user softdeleted strip personal fields KEEP username/profile_img for trend accountability

  if (user.privacy) {
    return {
      ...user,
      githubUsername: '',
    };
  }//privacy control

  return user;
};