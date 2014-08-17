define([
  "framework/App",
  "framework/modules/common/Common",

  "framework/modules/StateApp/Module"
],

function (App, Common, StateApp) {

  var StudentPicker = App.module();

  StudentPicker.Views.Participant = Common.Views.ParticipantDisplay.extend({
    cssClass: function (model) { // make students bounce
      var css = "animated ";
      if (model.get("choice")) {
        return css + "bounce";
      }
      return css;
    },

    // we just want the image -- no text.
    mainText: function (model) { },
    idText: function (model) { },

    overlay: function (model) { }
  });

  StudentPicker.Views.Grid = App.registerView("StudentPicker::grid", Common.Views.SimpleLayout.extend({
    header: "",
    ParticipantView: StudentPicker.Views.Participant
  }));


  StudentPicker.Views.Pick = App.registerView("StudentPicker::pick", Common.Views.SimpleLayout.extend({
    template: "app/apps/StudentPicker/templates/pick",
    className: "StudentPicker-pick",
    ParticipantView: StudentPicker.Views.Participant,

    // beforeRender: function () {
    //   this.setView(".participants", new Common.Views.ParticipantsGrid({ participants: this.participants }));
    // },

    afterRender: function () {
      // animate
      var numParticipants = this.participants.length;
      var winner = this.options.winner;
      console.log("Winner is ", winner, this.participants[winner]);
      var $outer = this.$el.find(".picker-outer");
      var $participants = this.$el.find(".participant");
      if (numParticipants - winner > winner) { // start at farthest end
        $outer.scrollTo($participants.last());
      }
      $outer.scrollTo($participants.eq(winner), 1000);
    },
  }));


  ///////////////// STATES
  StudentPicker.Grid = StateApp.ViewState.extend({
    name: "grid",
    view: "StudentPicker::grid",

    viewOptions: function () {
      return { participants: this.input.participants || this.options.participants };
    },

    addNewParticipants: function () {
      this.input.participants.addNewParticipants();
    },

    // outputs a participant participants
    onExit: function () {
      var participants = this.input.participants || this.options.participants;

      // remove any choice they may have set that could have caused a bounce animation
      participants.each(function (participant) {
        participant.unset("choice");
      });

      return new StateApp.StateMessage({ participants: participants });
    },
  });

  StudentPicker.Pick = StateApp.ViewState.extend({
    name: "pick",
    view: "StudentPicker::pick",

    viewOptions: function () {
      return {
        participants: this.input.participants,
        winner: this.winner
      };
    },

    addNewParticipants: function () {
      // do nothing -- don't want to add in students during picking phase.
    },

    beforeRender: function () {
      var numParticipants = this.input.participants.length;
      this.winner = Math.floor(Math.random() * numParticipants);
    }
  });

  return StudentPicker;
});