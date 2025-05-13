class Tribute {
    constructor(name, gender, district, speed, power, intelligence, popularity, risk, survivalSkills, combatSkills, luck) {
      this.name = name;
      this.gender = gender;
      this.district = district;
      this.speed = speed;
      this.power = power;
      this.intelligence = intelligence;
      this.popularity = popularity;
      this.risk = risk;
      this.survivalSkills = survivalSkills;
      this.combatSkills = combatSkills;
      this.luck = luck;
      this.hp = 100;
      this.weapon = "none";
      this.hasArmor = "no";
      this.armorDurability = 0;
      this.medKits = 0;
      this.isAlive = true;
      this.kills = 0;
      this.killedTributes = [];
      this.causeOfDeath = "none";
    }

    set name(value) {
      if (!value.trim()) {
        throw new Error("Please enter all name fields!");
      }
      if(CheckIfNumber(value)){
        throw new Error("Names cannot be just numbers!");
      }
      this._name = value;
    }

    get name() {
      return this._name;
    }

    set gender(value) {
      this._gender = value;
    }


    get gender() {
      return this._gender;
    }

    set district(value) {
      if(CheckIfNumber(value)){
        if (value < 1 || value > 12) {
          throw new Error("Please enter a number between 1 and 12!");
        }
      } else{
        throw new Error("Please enter valid numbers!");
      }
      this._district = value;
    }

    get district() {
      return this._district;
    }

    set speed(value) {
      if(CheckIfNumber(value)){
        if (value < 1 || value > 10) {
          throw new Error("Please enter a number between 1 and 10!");
        }
      } else{
        throw new Error("Please enter valid numbers!");
      }
      this._speed = value;
    }

    get speed() {
      return this._speed;
    }

    set power(value) {
      if(CheckIfNumber(value)){
        if (value < 1 || value > 10) {
          throw new Error("Please enter a number between 1 and 10!");
        }
      } else{
        throw new Error("Please enter valid numbers!");
      }
      this._power = value;
    }

    get power() {
      return this._power;
    }

    set intelligence(value) {
      if(CheckIfNumber(value)){
        if (value < 1 || value > 10) {
          throw new Error("Please enter a number between 1 and 10!");
        }
      } else{
        throw new Error("Please enter valid numbers!");
      }
      this._intelligence = value;
    }

    get intelligence() {
      return this._intelligence;
    }

    set popularity(value) {
      if(CheckIfNumber(value)){
        if (value < 1 || value > 10) {
          throw new Error("Please enter a number between 1 and 10!");
        }
      } else{
        throw new Error("Please enter valid numbers!");
      }
      this._popularity = value;
    }

    get popularity() {
      return this._popularity;
    }

    set risk(value) {
      if(CheckIfNumber(value)){
        if (value < 1 || value > 10) {
          throw new Error("Please enter a number between 1 and 10!");
        }
      } else{
        throw new Error("Please enter valid numbers!");
      }
      this._risk = value;
    }

    get risk() {
      return this._risk;
    }

    set survivalSkills(value) {
      if(CheckIfNumber(value)){
        if (value < 1 || value > 10) {
          throw new Error("Please enter a number between 1 and 10!");
        }
      } else{
        throw new Error("Please enter valid numbers!");
      }
      this._survivalSkills = value;
    }

    get survivalSkills() {
      return this._survivalSkills;
    }

    set combatSkills(value) {
      if(CheckIfNumber(value)){
        if (value < 1 || value > 10) {
          throw new Error("Please enter a number between 1 and 10!");
        }
      } else{
        throw new Error("Please enter valid numbers!");
      }
      this._combatSkills = value;
    }

    get combatSkills() {
      return this._combatSkills;
    }

    set luck(value) {
      if(CheckIfNumber(value)){
        if (value < 1 || value > 10) {
          throw new Error("Please enter a number between 1 and 10!");
        }
      } else{
        throw new Error("Please enter valid numbers!");
      }
      this._luck = value;
    }

    get luck() {
      return this._luck;
    }

    get hp() {
      return this._hp;
    }

    set hp(value) {
      this._hp = value;
    }

    get weapon() {
      return this._weapon;
    }

    set weapon(value) {
      this._weapon = value;
    }

    get armorDurability() {
      return this._armorDurability;
    }

    set armorDurability(value) {
      this._armorDurability = value;
    }

    get medKits() {
      return this._medKits;
    }

    set medKits(value) {
      this._medKits = value;
    }

    get isAlive() {
      return this._isAlive;
    }

    set isAlive(value) {
      this._isAlive = value;
    }

  get hasArmor() {
    return this._hasArmor;
  }

  set hasArmor(value) {
    this._hasArmor = value;
  }

  get kills() {
    return this._kills;
  }

  set kills(value) {
    this._kills = value;
  }

  get causeOfDeath() {
    return this._causeOfDeath;
  }

  set causeOfDeath(value) {
    this._causeOfDeath = value;
  }

    // Do damage to the tribute
  DoDamage(damageDone) {
    if (damageDone < 0) {
      throw new Error("Damage cannot be negative!");
    }

    // Handle damage depending on armor durability
    const damageTaken = this.armorDurability !== 0 ? damageDone / 2 : damageDone;
    this.hp -= damageTaken;

    // If the tribute has armor, reduce its durability
    if (this.armorDurability !== 0) {
      this.armorDurability -= 1;
      if(this.armorDurability === 0){
        this.hasArmor = "no";
      }
    }

    // Medkit logic: Check if HP is <= 60 and medkits are available
    if (this.hp <= 60 && this.medKits > 0) {
      this.medKits -= 1;
      this.hp += 40;
      return { medKitUsed: true }; // Return true if medkit was used
    }

    // If HP is less or equal than 0, mark the tribute as dead
    if (this.hp <= 0) {
      this.hp = 0;
      this.isAlive = false;
    }

    return { medKitUsed: false }; // Return false if no medkit was used
  }


  // Find armor and equip it
  FindArmor() {
    if (this.armorDurability === 0) {
      this.armorDurability = 5;
      this.hasArmor = "yes";
    } else {
      throw new Error("This tribute already has armor!");
    }
  }

  // Find a medkit
  FindMedKit(amount) {
    if (this.medKits === 2) {
      throw new Error("This tribute already has the max amount of medkits (2)!");
    } else if (this.medKits === 1) {
      this.medKits += 1;
    } else {
      this.medKits += amount;
    }
  }

  KillTribute() {
    this.hp = 0;
    this.isAlive = false;
  }

  // Add a kill to the tribute's record
  AddKill(tribute) {
    this.kills += 1;
    this.killedTributes.push(tribute);
  }
}

  function CheckIfNumber(value){
    let n = parseInt(value);
    if (!isNaN(n)) {
        return true;
    } else {
        return false;
    }
  }

  function CheckToUseMedKit() {
    if (this.medKits > 0 && this.hp <= 60) {
      this.medKits -= 1;
      this.hp += 40;
      return { medKitUsed: true }; // Return this if medkit was used
  }
}