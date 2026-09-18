# Historical Handoffs

Historical records are loaded on demand.

## Recovered pre-release local continuity

During the primary checkout fast-forward, Git replaced an ignored local continuity file when that path became tracked. The last recorded copy was recovered from a project-scoped session record. Its byte count matches the September 16 inventory; no pre-sync content hash existed, so later unrecorded edits cannot be ruled out. The current release checkpoint remains current; the recovered record is historical.

- Archive: `archives/pre-4.1-local-HANDOFF.md`
- Recovered original bytes: 4404
- Original SHA-256: `1009ab5068b872289ff61720ed995c4a2d7d9ad4268eb08b7d5d6e0dabbf2e20`
- Shared archive SHA-256: `d88c932d21938b401ed4d0aaf66e7593bb62d326040489725c325e4f2596c8bb`
- Provenance: recorded full HANDOFF write, April 9, 2026; home paths made portable in the shared copy.

## Release checkpoint before recovery note

Original SHA-256: `89be79d7bfd9485343157a101bb62b5f81765fd83f5bb1bc472def73896d3042`

<!-- BEGIN RELEASE CHECKPOINT -->
# Current Handoff

September 18, 2026: advertise PossibNow Dev Harness 4.1.0 after its matching release reaches source main. This update changes only that marketplace entry and makes this sanitized release record trackable; the other plugin is unchanged.

The harness release adds /optimize and shared current/historical continuity. Its source suite passed 172 tests; plugin/skill validation passed. Marketplace JSON parses and the plugin source URL remains unchanged.

Next: merge this version update after the source release, update the installed marketplace/plugin through Claude CLI, and verify installed version/command files. No active user projects are migrated by this metadata change.
<!-- END RELEASE CHECKPOINT -->
