const chalk = require('chalk');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;

class ProjectsList extends BaseCommand {
  async run() {
    await super.run();
    if (this.userConfig.projects.length > 0) {
      // If none of the projects have a region, delete it from all of them so it doesn't show up in the output.
      if (!this.userConfig.projects.some(p => p.region)) {
        this.userConfig.projects.forEach(p => delete p.region);
      }
      const activeProject = this.userConfig.getActiveProject();
      this.userConfig.projects.forEach(p => {
        if (p.id === activeProject.id) {
          p.active = true;
        }
      });
      this.output(this.userConfig.projects);
    } else {
      this.logger.warn('No projects have been configured. Run ' + chalk.whiteBright('twilio projects:add') + ' to add one!');
    }
  }
}

ProjectsList.description = 'show what Twilio projects you have configured';
ProjectsList.flags = BaseCommand.flags;

module.exports = ProjectsList;
