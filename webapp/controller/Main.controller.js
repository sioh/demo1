sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("playground.playground.controller.Main", {

		onInit : function () {
			var oViewModel,
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

			oViewModel = new JSONModel({
				busy: false,
				delay: iOriginalBusyDelay
			});
			this.setModel(oViewModel, "pageView");

			// apply content density mode to root view
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
		
		createNewEntry: function(oEvent) {
			var oLineItemContext = this.getModel().createEntry("/ValuesSet");
			var oNewLineItem = new sap.m.ColumnListItem({
				cells: [
					new sap.m.Text({text: "{ID}"}),
					new sap.m.HBox({
						items: [
							new sap.m.Label({text: "{Unit}"}),
							new sap.m.Input({value: "{path: 'Value', type: 'sap.ui.model.type.Float', formatOptions: {maxFractionDigits : 2, minFractionDigits: 2}}"})
						]
					}),
					new sap.m.Text({text:"{Unit}"})
				]
			});
			oNewLineItem.setBindingContext(oLineItemContext);
			var oTable = oEvent.getSource().getParent().getParent();
			
			oTable.insertItem(oNewLineItem, -1);
			//oTable.updateAggregation("items");
		}
	});

});