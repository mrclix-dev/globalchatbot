class AnswerBuilder {
	/**
	 * Create an AnswerBuilder.
	 * @param {Object} [data={}] - Initial data for the answer.
	 */
	constructor(data = {}) {
		this.data = data;
	}

	/**
	 * Set the label for the answer.
	 * @param {string} label - The label text for the answer.
	 * @returns {AnswerBuilder} - The instance of the AnswerBuilder for chaining.
	 * @throws {TypeError} - If the label is not a string.
	 */
	setLabel(label) {
		if (typeof label !== "string") throw new TypeError("AnswerBuilder: label must be a string");
		this.data.text = label;
		return this;
	}

	/**
	 * Set the emoji for the answer.
	 * @param {string} emoji - The emoji for the answer.
	 * @returns {AnswerBuilder} - The instance of the AnswerBuilder for chaining.
	 * @throws {TypeError} - If the emoji is not a string.
	 */
	setEmoji(emoji) {
		if (typeof emoji !== "string") throw new TypeError("AnswerBuilder: emoji must be a string");
		this.data.emoji = emoji;
		return this;
	}

	/**
	 * Get the data for the answer.
	 * @returns {Object} - The data of the answer.
	 */
	getData() {
		return this.data;
	}
}

class PollBuilder {
	/**
	 * Create a PollBuilder.
	 * @param {Object} [data={}] - Initial data for the poll.
	 */
	constructor(data = {}) {
		this.data = data;
		this.data.answers = [];
	}

	/**
	 * Set the title for the poll.
	 * @param {string} text - The title text for the poll.
	 * @returns {PollBuilder} - The instance of the PollBuilder for chaining.
	 * @throws {TypeError} - If the title is not a string.
	 */
	setTitle(text) {
		if (typeof text !== "string") throw new TypeError("PollBuilder: title must be a string");
		this.data.question = { text: text };
		return this;
	}

	/**
	 * Set the duration time for the poll.
	 * @param {number} duration - The duration in hours.
	 * @returns {PollBuilder} - The instance of the PollBuilder for chaining.
	 * @throws {TypeError} - If the duration is not a number.
	 * @throws {RangeError} - If the duration is not between 1 and 768.
	 */
	setDurationTime(duration) {
		if (typeof duration !== "number") throw new TypeError("PollBuilder: duration must be a number");
		if (duration < 1 || duration > 768) throw new RangeError("PollBuilder: duration must be between 1 and 768 hours");
		this.data.duration = duration;
		return this;
	}

	/**
	 * Allow or disallow multiple selection of answers.
	 * @param {boolean} bool - Whether to allow multiple selection.
	 * @returns {PollBuilder} - The instance of the PollBuilder for chaining.
	 * @throws {TypeError} - If the argument is not a boolean.
	 */
	allowMultiselect(bool) {
		if (typeof bool !== "boolean") throw new TypeError("PollBuilder: allowMultiselect must be a boolean");
		this.data.allowMultiselect = bool;
		return this;
	}

	/**
	 * Add answers to the poll.
	 * @param {...(AnswerBuilder|Object[])} args - Instances of AnswerBuilder or an array of answer objects.
	 * @returns {PollBuilder} - The instance of the PollBuilder for chaining.
	 * @throws {TypeError} - If arguments are not valid.
	 */
	addAnswers(...args) {
		if (args.length === 1 && Array.isArray(args[0])) {
			const answersArray = args[0];
			for (let answer of answersArray) {
				if (typeof answer.text !== "string" || typeof answer.emoji !== "string") {
					throw new TypeError("PollBuilder: answer objects in the array must have text and emoji as strings");
				}
				this.data.answers.push(answer);
			}
		} else {
			for (let answer of args) {
				if (!(answer instanceof AnswerBuilder)) throw new TypeError("PollBuilder: all arguments must be instances of AnswerBuilder or an array of answer objects");
				this.data.answers.push(answer.getData());
			}
		}
		return this;
	}

	toJSON(){
		return this.data
	}

	toString(){
		return JSON.stringify(this.data)
	}
}

/**
 * Import this class to the discord.js module
 * The person must need add this file in the project and run this as
 * require(./PollBuilder)
 */
const Discord = require("discord.js");
Discord.PollBuilder = PollBuilder;
Discord.AnswerBuilder = AnswerBuilder;
//# ----------------------------- #//
