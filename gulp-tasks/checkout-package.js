const path = require('path')
const through = require('through2')
const output = 'checkout.sh';
const scriptName = path.basename(__filename);
const PLUGIN_NAME = 'gulp-sfdc-' + scriptName;
const xml2js = require('xml2js');

module.exports = (gulp, plugins,options) => {
  const branch = process.argv[process.argv.length-1];
  return cb => {
    let status = null;
    gulp.src(options.src+'/package.xml')
    .pipe(checkout(branch))
    .pipe(plugins.rename(output))
    .pipe(gulp.dest(options.repo))
    .on('end', cb);
  };
};

// TODO meta-xml

checkout = (branch) => {
  return through.obj((file, enc, callback) => {
    let err;
    if (file.isNull()) {
      return callback(null, file);
    }
    if (file.isStream()) {
      return callback(new PluginError(PLUGIN_NAME, 'Stream input is not supported'));
    }

    const commandLines = new Set();
    commandLines.add('#!/bin/bash');
    parseStringAsync(file.contents.toString())
    .then(package=>{
      package.Package.types.forEach(type=>{
        type.members.forEach(member=>{
          commandLines.add(`git checkout ${branch} -- src/${metadataMapping[type.name]}/${member.split('.')[0]}.${metadataMapping[type.name].slice(0,metadataMapping[type.name].length-1)}`)
          commandLines.add(`git checkout ${branch} -- src/${metadataMapping[type.name]}/${member.split('.')[0]}${metadataMapping[type.name].slice(0,metadataMapping[type.name].length-1)}-meta.xml`)
        })
      })
      file.contents =  Buffer.from([...commandLines].join('\n'), 'utf8');
    })
    .then(()=>callback(null, file));
  });
};

const parseStringAsync = (xmlContent) => {
  const promise = new Promise((resolve, reject) => {
    const parser = new xml2js.Parser();
    parser.parseString(xmlContent.replace('\ufeff', ''), (err, result) => err && reject(err) || resolve(result));
  });
  return promise;
};

const metadataMapping = {
  "CustomPermission":"customPermissions",
  "CustomLabels":"labels",
  "StaticResource":"staticresources",
  "Scontrol":"scontrols",
  "ApexComponent":"components",
  "CustomMetadata":"customMetadata",
  "GlobalValueSet":"globalValueSets",
  "GlobalValueSetTranslation":"globalValueSetTranslations",
  "PathAssistant":"pathAssistants",
  "StandardValueSet":"standardValueSets",
  "StandardValueSetTranslation":"standardValueSetTranslations",
  "Translations":"translations",
  "ApexPage":"pages",
  "Queue":"queues",
  "CustomField":"objects",
  "CustomObject":"objects",
  "ReportType":"reportTypes",
  "Report":"reports",
  "Dashboard":"dashboards",
  "AnalyticSnapshot":"analyticSnapshots",
  "Layout":"layouts",
  "Portal":"portals",
  "Document":"documents",
  "CustomPageWebLink":"weblinks",
  "QuickAction":"quickActions",
  "FlexiPage":"flexipages",
  "CustomTab":"tabs",
  "CustomApplicationComponent":"customApplicationComponents",
  "CustomApplication":"applications",
  "Letterhead":"letterhead",
  "EmailTemplate":"email",
  "Workflow":"workflows",
  "AssignmentRules":"assignmentRules",
  "AutoResponseRules":"autoResponseRules",
  "EscalationRules":"escalationRules",
  "Role":"roles",
  "Group":"groups",
  "PostTemplate":"postTemplates",
  "ApprovalProcess":"approvalProcesses",
  "HomePageComponent":"homePageComponents",
  "HomePageLayout":"homePageLayouts",
  "CustomObjectTranslation":"objectTranslations",
  "Flow":"flows",
  "ApexClass":"classes",
  "ApexTrigger":"triggers",
  "Profile":"profiles",
  "PermissionSet":"permissionsets",
  "DataCategoryGroup":"datacategorygroups",
  "RemoteSiteSetting":"remoteSiteSettings",
  "AuthProvider":"authproviders",
  "LeadSharingRules":"leadSharingRules",
  "CampaignSharingRules":"campaignSharingRules",
  "CaseSharingRules":"caseSharingRules",
  "ContactSharingRules":"contactSharingRules",
  "OpportunitySharingRules":"opportunitySharingRules",
  "AccountSharingRules":"accountSharingRules",
  "CustomObjectSharingRules":"customObjectSharingRules",
  "Community":"communities",
  "CallCenter":"callCenters",
  "ConnectedApp":"connectedApps",
  "SamlSsoConfig":"samlssoconfigs",
  "SynonymDictionary":"synonymDictionaries",
  "Settings":"settings",
  "AuraDefinitionBundle":"aura",
  "LightningComponentBundle":"lwc",
  "SharingRules":"sharingRules",
  "ContentAsset":"contentassets",
  "Network":"networks",
  "SiteDotCom":"siteDotComSites",
  "FlowDefinition":"flowDefinitions",
  "MatchingRules":"matchingRules",
  "TopicsForObjects":"topicsforobjects",
  "PlatformCachePartition":"cachePartitions",
  "DuplicateRule":"duplicateRules"
}