// Helper for sending email notifications to the admin via Web3Forms (or can be adapted to EmailJS, Formspree, etc.)
// Requires the user to have provided an 'emailNotificationKey' in the dashboard.

export const sendAdminNotification = async (
  accessKey: string | undefined, 
  subject: string, 
  data: Record<string, string | number | undefined>
) => {
  if (!accessKey) {
    console.log('Skipping email notification: no access key provided in settings.');
    return;
  }

  try {
    // Format the data nicely
    const formattedData = Object.entries(data)
      .filter(([_, value]) => value !== undefined && value !== '')
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `JKK ETOILE Notification: ${subject}`,
        message: `Une nouvelle demande a été soumise sur votre site.\n\nDétails de la demande:\n\n${formattedData}`,
      })
    });

    const result = await response.json();
    if (!response.ok) {
      console.error('Failed to send email notification:', result);
    } else {
      console.log('Admin email notification sent successfully');
    }
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
};
