import moment from 'moment';
import * as React from 'react';
import Picker from 'react-native-picker';

import { AdsInitialBudgetValue, Currencies, dateFormatMomentJS } from '../../environment/consts';
import { IConfirmation } from '../../store/ui/overlays';
import { IAdSetupBudgetData, ITranslatedProps } from '../../types';
import { defaultStyles } from './NewAdConfigBudgetScreen.style';
import { NewAdConfigBudgetScreenView } from './NewAdConfigBudgetScreen.view';

interface INewAdConfigBudgetScreenProps extends ITranslatedProps {
	showConfirmation: (confirmation: IConfirmation) => void;
}

interface INewAdConfigBudgetScreenState {
	budgetValue: string;
	selectedCurrencyValue: string;
	perDayPressed: boolean;
	lifetimePressed: boolean;
	runAdContinuouslyPressed: boolean;
	isStartDatePickerVisible: boolean;
	isStopDatePickerVisible: boolean;
	selectedStartDate: string;
	selectedStopDate: string;
	nextDayFromStartDate: Date;
}

export class NewAdConfigBudgetScreen extends React.Component<
	INewAdConfigBudgetScreenProps,
	INewAdConfigBudgetScreenState
> {
	public state = {
		budgetValue: AdsInitialBudgetValue,
		selectedCurrencyValue: Currencies[0].toUpperCase(),
		perDayPressed: true,
		lifetimePressed: false,
		runAdContinuouslyPressed: true,
		isStartDatePickerVisible: false,
		isStopDatePickerVisible: false,
		selectedStartDate: 'DD/MM/JJJJ',
		selectedStopDate: 'DD/MM/JJJJ',
		nextDayFromStartDate: new Date(),
	};

	private currentDate = new Date();

	public render() {
		const { getText } = this.props;
		const {
			selectedCurrencyValue,
			budgetValue,
			perDayPressed,
			lifetimePressed,
			runAdContinuouslyPressed,
			selectedStartDate,
			selectedStopDate,
			isStartDatePickerVisible,
			isStopDatePickerVisible,
			nextDayFromStartDate,
		} = this.state;

		return (
			<NewAdConfigBudgetScreenView
				getText={getText}
				currencyButtonPressed={this.currencyButtonPressed}
				selectedCurrencyValue={selectedCurrencyValue}
				budgetValue={budgetValue}
				submitBudget={this.submitBudget}
				perDayPressed={perDayPressed}
				lifetimePressed={lifetimePressed}
				runAdContinuouslyPressed={runAdContinuouslyPressed}
				selectedStartDate={selectedStartDate}
				selectedStopDate={selectedStopDate}
				handleCheckboxChange={this.handleCheckboxChange}
				isStartDatePickerVisible={isStartDatePickerVisible}
				isStopDatePickerVisible={isStopDatePickerVisible}
				handleDatePicker={this.handleDatePicker}
				currentDate={this.currentDate}
				nextDayFromStartDate={nextDayFromStartDate}
				handleStartDatePicked={this.handleStartDatePicked}
				handleStopDatePicked={this.handleStopDatePicked}
			/>
		);
	}

	public getAdBudgetData = (): IAdSetupBudgetData => {
		const {
			selectedCurrencyValue,
			budgetValue,
			perDayPressed,
			lifetimePressed,
			runAdContinuouslyPressed,
			selectedStartDate,
			selectedStopDate,
		} = this.state;

		return {
			currency: selectedCurrencyValue,
			budget: parseInt(budgetValue, 10),
			perDay: perDayPressed,
			lifetime: lifetimePressed,
			runAdContinuously: runAdContinuouslyPressed,
			start: selectedStartDate,
			stop: selectedStopDate,
		};
	};

	private currencyButtonPressed = () => {
		const { getText } = this.props;
		Picker.init({
			pickerData: Currencies.map((value: string) => value.toUpperCase()),
			pickerTitleColor: defaultStyles.pickerTitleColor,
			pickerConfirmBtnColor: defaultStyles.pickerConfirmAndCancelBtnColor,
			pickerCancelBtnColor: defaultStyles.pickerConfirmAndCancelBtnColor,
			pickerBg: defaultStyles.pickerToolbarAndBgColor,
			pickerToolBarBg: defaultStyles.pickerToolbarAndBgColor,
			selectedValue: [1],
			pickerTitleText: getText('ad.management.budget.currency.picker.select'),
			pickerConfirmBtnText: getText('button.confirm'),
			pickerCancelBtnText: getText('button.cancel'),
			onPickerConfirm: (data) => {
				this.setState({ selectedCurrencyValue: data[0] });
				Picker.hide();
			},
		});
		Picker.show();
	};

	private submitBudget = (newBudget: string) => {
		Picker.hide();
		this.setState({ budgetValue: newBudget.replace(/[^0-9]/g, '') });
	};

	private handleCheckboxChange = (checkboxName: 'perday' | 'lifetime' | 'runAdContinuously') => {
		Picker.hide();
		if (checkboxName) {
			if (checkboxName === 'perday') {
				this.setState({
					lifetimePressed: false,
					perDayPressed: true,
				});
			}
			if (checkboxName === 'lifetime') {
				this.setState({
					perDayPressed: false,
					lifetimePressed: true,
				});
			}
			if (checkboxName === 'runAdContinuously') {
				if (this.state.runAdContinuouslyPressed) {
					this.setState({ runAdContinuouslyPressed: false });
				} else {
					this.setState({
						runAdContinuouslyPressed: true,
						selectedStartDate: 'DD/MM/JJJJ',
						selectedStopDate: 'DD/MM/JJJJ',
					});
				}
			}
		}
	};

	private handleDatePicker = (datePicker: 'startDatePicker' | 'stopDatePicker' | 'hidePicker') => {
		if (datePicker) {
			if (datePicker === 'startDatePicker') {
				this.setState({
					isStartDatePickerVisible: true,
					isStopDatePickerVisible: false,
				});
			}
			if (datePicker === 'stopDatePicker') {
				this.setState({
					isStartDatePickerVisible: false,
					isStopDatePickerVisible: true,
				});
			}
			if (datePicker === 'hidePicker') {
				this.setState({
					isStartDatePickerVisible: false,
					isStopDatePickerVisible: false,
				});
			}
		}
	};

	private handleStartDatePicked = (date: Date) => {
		const formattedStartDate = moment(date).format(dateFormatMomentJS.configBudgetScreen);
		this.setState({ selectedStartDate: formattedStartDate });
		this.calculateStopDateFromStartDate(date);
		this.handleDatePicker('hidePicker');
	};

	private handleStopDatePicked = (date: Date) => {
		const formattedStopDate = moment(date).format(dateFormatMomentJS.configBudgetScreen);
		this.setState({ selectedStopDate: formattedStopDate });
		this.handleDatePicker('hidePicker');
	};

	private calculateStopDateFromStartDate = (selectedStartDate: Date) => {
		const newDate = new Date(selectedStartDate);
		newDate.setDate(selectedStartDate.getDate() + 1);

		const formattedNewDate = moment(newDate).format(dateFormatMomentJS.configBudgetScreen);
		this.setState({
			selectedStopDate: formattedNewDate,
			nextDayFromStartDate: newDate,
		});
	};
}
