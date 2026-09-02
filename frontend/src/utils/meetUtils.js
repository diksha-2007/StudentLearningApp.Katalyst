// Google Meet launcher and link generator helper

export const getGoogleMeetLink = (meeting) => {
  if (meeting?.meetLink && meeting.meetLink.trim() !== "") {
    if (meeting.meetLink.startsWith("http")) {
      return meeting.meetLink;
    }
    return `https://${meeting.meetLink}`;
  }

  // Generate a clean session link using meeting ID or unique code
  if (meeting?._id) {
    const cleanId = String(meeting._id).slice(-9);
    const part1 = cleanId.slice(0, 3);
    const part2 = cleanId.slice(3, 7);
    const part3 = cleanId.slice(7, 9) || "meet";
    return `https://meet.google.com/${part1}-${part2}-${part3}`;
  }

  return "https://meet.google.com/new";
};

export const openGoogleMeet = (meeting) => {
  const url = getGoogleMeetLink(meeting);
  window.open(url, "_blank", "noopener,noreferrer");
};
