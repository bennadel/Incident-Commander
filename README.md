
# Incident Commander

by [Ben Nadel][bennadel] (on [Google+][googleplus])

**[Run Incident Commander App][app]** »

When an **Incident** is opened at [InVision App][invisionapp], one of the engineers has 
to run "point", acting as the liaison between the management / support teams and the 
engineers that are actively investigating the root cause. This point person is known as 
the "Incident Commander"; and, is responsible for communicating regular updates to one
of the company's Slack channels.

When I take on the role of Incident Commander, I like to use a specific format for my
Slack updates. If you've ever looked at my code, you know that I am very particular about
my formatting. These incident updates are no different. So, in order to make my life a 
little bit easier, I've put together a small Angular application that transforms incident 
updates into a tightly-formatted Slack message that I can quickly copy-and-paste into our
`#Incident` channel.

## Features

* **Firebase** - The current incident is stored both locally and remotely using the 
  [Firebase][firebase] Backend-as-a-Service (Baas) library. This is a **public
  database**, which means you shouldn't store _overly-sensitive_ information in your 
  incident. However, the URLs for the individual incidents are extremely hard to guess.
  And, you can **delete your incident** when you are done with it (which will delete it
  from Firebase as well). That said, the benefit of using Firebase is that you can 
  copy-and-paste an Incident URL to another teammate who can take-over as the Incident
  Commander.
* **Local Timezone** - The `#Incident` channel has to be updated using the EST timezone.
  Which is difficult for the majority of people who are not on the east coast. In this 
  app, you can use your local timezone and the generated Slack message will automatically
  be formatted with EST times.
* **Configurable Formatting** - Depending on where you are in the incident process, you 
  may want to show more or less information (so as not to clutter up the Slack channel).
  This app allows you to change the number of updates that are rendered, and the 
  compactness of the timeline. This way, you can keep the messaging compact mid-incident;
  then, post a more comprehensive, more _readable_ version at the end.


[bennadel]: https://www.bennadel.com
[googleplus]: https://plus.google.com/108976367067760160494?rel=author
[invisionapp]: https://www.bennadel.com/invision/co-founder.htm
[app]: https://www.incident-commander.com/
[firebase]: https://firebase.google.com/
