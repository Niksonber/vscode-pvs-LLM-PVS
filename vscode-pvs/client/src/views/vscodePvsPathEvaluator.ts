import { LanguageClient } from "vscode-languageclient";
import { EvalExpressionRequest, PvsioEvaluatorCommand, serverRequest } from "../common/serverInterface";
import { PvsResponse } from "../common/pvs-gui";
import { VSCodePvsFileViewer } from "./vscodePvsFileViewer";
import { fname2desc } from "../common/fsUtils";
import * as vscodeUtils from '../utils/vscode-utils';

/**
 * @module VSCodePvsPathEvaluator
 * @author Mariano Moscato
 * @date 2025.09.14
 * 
 * The main goal of this class is to evaluate a PVS expression denoting a valid path
 * to a local resource using PVSio and open the referenced resource.
 * 
 */
export class VSCodePvsPathEvaluator {
  protected client: LanguageClient;
  // file viewer
  protected fileViewer: VSCodePvsFileViewer;
  /**
   * Constructor
   */
  constructor (client: LanguageClient, fileViewer: VSCodePvsFileViewer) {
    this.client = client;
    this.fileViewer = fileViewer;
  }
  /**
   * Evaluates the given expression. The expression must evaluate to a valid path.
   * If that's the case, this function tries to open the resource referenced by the path.
   * 
   * @param desc expression to be evaluated, its evaluation should result in a path to an existent file.
   * @returns 
   */
  async evaluateAndOpen(desc: EvalExpressionRequest): Promise<boolean>  {
    return new Promise((resolve, reject) => {
      if (desc && desc.expr) {
          const expr: string = desc.expr;
          
          vscodeUtils.showInformationMessage(`Evaluating ${desc.expr}...`);
          this.client.sendRequest(serverRequest.evalExpression, desc);
          this.client.onNotification(serverRequest.evalExpression, async (desc: {
              req: PvsioEvaluatorCommand,
              response: PvsResponse
          }) => {
              var data: string = desc?.response.result?.pvsResult;
              const errorMsg: string = desc?.response.result?.errOut || desc?.response.result?.stdOut || desc?.response.error?.data;
              // remove output prompts and new lines @M3
              data = data?.replace(/\n/g, '');
              data = data.slice(1,-1); // remove quotation marks
              // update plot
              if (data) {
                vscodeUtils.openFile(data);
              } else
                if (errorMsg) 
                    vscodeUtils.showErrorMessage(`Error when evaluating the expression ${expr}: ${errorMsg}`, -1);
                else 
                    vscodeUtils.showErrorMessage(`No response received when trying to evaluate the expression ${expr}`, -1);
                reject(false);
          })
      } else 
          resolve(false); }); 
  }
}