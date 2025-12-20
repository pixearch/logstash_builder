Logstash Builder

A modern, GUI-based tool designed to simplify the creation and visualization of Logstash pipelines. Built based on Logstash documentation version 9.0+

🚀 Features

- Visual Pipeline Builder: An intuitive interface to design your Logstash input, filter, and output stages without writing raw configuration manually.

- Drag and Drop or Double Click plugins on the left that you want to add

- Add, update, or remove the configuration options on the far right
  - if a custom config option is needed to be added, there is an add custom property for you on the bottom right of the properties panel

- Drag and Drop reordering of the plugins in the middle work area

- An Insights button give a list of detected fields 
  - This shows which plugins have correlating fields to trace the data flow (i.e. message field in the input generator plugin feeding the message field in the filter grok plugin)

- A View Config button to see the raw config
  - You can copy striaght from there if you want with the copy button at the top right of the config

- An export button to download the config as is

- A reset button with confirmation to keep from accidentally resetting

- Confirmation on plugin deletions if you've modified the values at all to avoid accidentally deleting your work in a plugin

- Expand and Collapse all on the top left for the plugins list

- A filter as you type search bar to quickly search for plugins

- A validation check to make sure you do not put an input plugin into an output plugin, etc.

Winter Festive Mode ❄️:

- Automatically activates during the holiday season (December 1st – December 30th).

- Toggle "Festive Mode" in the top bar to turn the snow on or off.
