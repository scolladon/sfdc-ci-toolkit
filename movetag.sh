git checkout .
git tag -d $BRANCH$LAST_BUILD_TAG_SUFFIX
git push origin :refs/tags/$BRANCH$LAST_BUILD_TAG_SUFFIX
git tag -af $BRANCH$LAST_BUILD_TAG_SUFFIX -m "Last build for $BRANCH"
git push origin $BRANCH$LAST_BUILD_TAG_SUFFIX