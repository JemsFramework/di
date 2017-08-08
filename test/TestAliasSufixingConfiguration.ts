/// <reference path="../typings/index.d.ts" />

import * as assert from 'assert'
import * as jemsdi from "../distribution/Index";
import { IContainer } from "../distribution/IContainer";

describe('with an alias that contain sufixing configuration', function() {

    let kernel:jemsdi.IKernel =  jemsdi.createKernel();    

     before(function() {
        let container:IContainer = kernel.getDefaultContainer();
            
        container.registerDependencyMetadata('fakeType', ({
            servicingStrategy: jemsdi.ServicingStrategy.INSTANCE,
            activationReference: function() { this.fake = true; },
            activateAsSingelton: false
        }));

        container.registerDependencyMetadata('fakeType', ({
            servicingStrategy: jemsdi.ServicingStrategy.INSTANCE,
            activationReference: function() { this.fake = true; },
            activateAsSingelton: false
        }));

        container.registerDependencyMetadata('fakeType', ({
            servicingStrategy: jemsdi.ServicingStrategy.INSTANCE,
            activationReference: function() { this.fake = true; },
            activateAsSingelton: false
        }));
     });

   it('should resolve an array with instances of FakeTypeA, FakeTypeB, FakeTypeC with fakeType alias when is using the List sufix.', function() {
        let resolvedObjects:any[] = kernel.resolve('fakeTypeList');

        assert.equal(3, resolvedObjects.length, 'The resolved objects quantity must be 3.');

        resolvedObjects.forEach(function(resolvedObject:any) { if (!resolvedObject.hasOwnProperty('fake')) throw new Error('Not all resolved objects are correrct.')});             
    });

    it('should resolve an array with instances of FakeTypeA, FakeTypeB, FakeTypeC with fakeType alias when is using the OptionalList sufix.', function() {
        let resolvedObjects:any[] = kernel.resolve('fakeTypeOptionalList');

        assert.equal(3, resolvedObjects.length, 'The resolved objects quantity must be 3.');

        resolvedObjects.forEach(function(resolvedObject:any) { if (!resolvedObject.hasOwnProperty('fake')) throw new Error('Not all resolved objects are correrct.')});             
    });

    it('should resolve a null with fakeTypeUnexisting alias when is using the Optional sufix.', function() {        
        let resolvedObject:any = kernel.resolve('fakeTypeUnexistingOptional');
        
        assert.equal(null, resolvedObject, "The resolved object is not registered, it must be null.")
    });

    it('should resolve a null with fakeTypeUnexisting alias when is using the OptionalList sufix.', function() {        
        let resolvedObjects:any[] = kernel.resolve('fakeTypeUnexistingOptionalList');
        
        assert.equal(null, resolvedObjects, "The resolved object is not registered, it must be null.")
    });
});
