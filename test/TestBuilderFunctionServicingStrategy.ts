/// <reference path="../typings/index.d.ts" />

import * as assert from 'assert'
import * as jemsdi from "../source/Index";
import { IContainer } from "../source/IContainer";

describe('with builder function servicing strategy resolution', function() {

    let kernel:jemsdi.IKernel =  jemsdi.createKernel();
    let constantInstance = {};

    before(function () {

        let container:IContainer = kernel.getDefaultContainer();
        
        container.registerDependencyMetadata('fakeFunctionBuilder', ({
            servicingStrategy: jemsdi.ServicingStrategy.BUILDER_FUNCTION,
            activationReference: function() { return constantInstance; },
            activateAsSingelton: false
        }));            
    });

    it('should resolve the function value', function () {
        let resolvedObject:any = kernel.resolve('fakeFunctionBuilder');
        assert.ok(resolvedObject === constantInstance, 'The resolved object is not the function value.');        
    });
});
