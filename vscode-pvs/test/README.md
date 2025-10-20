## Regression tests
This folder contains pvs files and scripts used for the regression tests of VSCode-PVS. 

## How to run the regression test
1. Launch pvs in server mode on port 23456 (./pvs -raw -port 23456)
2. Launch the regression test (npm run test)

## IMPORTANT NOTE
** DO NOT USE THE PVS FILES ** contained in the subfolders of this directory: some of them contain intentional typecheck/parsing errors designed to test corner cases of VSCode-PVS.

